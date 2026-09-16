<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/emailContent.php';

if ((int)query("SELECT GET_LOCK('matcha_mail_worker',0)")->fetchColumn() !== 1) exit;
try {
    $options=getopt('',['campaign:']);
    if(isset($options['campaign'])){
        $campaign=$options['campaign'];
        if(!is_string($campaign)||!preg_match('/^[a-zA-Z0-9_-]{1,64}$/D',$campaign)) throw new RuntimeException('Invalid campaign ID');
        query("INSERT IGNORE INTO email_jobs(dedupe_key,kind,recipient,subscriber_id,payload)
          SELECT CONCAT(?,':',id),'newsletter',email,id,JSON_OBJECT() FROM newsletter_subscribers
          WHERE status='subscribed' AND confirmed_at IS NOT NULL",['campaign:'.$campaign]);
    }
    $jobs=query('SELECT * FROM email_jobs WHERE sent_at IS NULL AND cancelled_at IS NULL AND attempts<5 AND available_at<=NOW() ORDER BY id LIMIT 20')->fetchAll();
    foreach($jobs as $job){
        if(!query('SELECT id FROM email_jobs WHERE id=? AND sent_at IS NULL AND cancelled_at IS NULL',[$job['id']])->fetch())continue;
        $payload=json_decode($job['payload'],true,512,JSON_THROW_ON_ERROR);
        if($job['kind']==='member'){
            $person=query('SELECT id,email,full_name FROM members WHERE id=?',[$payload['user_id']])->fetch();
            $valid=$person&&$person['email']===$job['recipient'];
        }else{
            $person=query("SELECT *,JSON_UNQUOTE(JSON_EXTRACT(interests,'$[0]')) AS menu FROM newsletter_subscribers WHERE id=?",[$job['subscriber_id']])->fetch();
            $valid=$person&&($job['kind']==='newsletter'
                ?$person['status']==='subscribed'&&!empty($person['confirmed_at'])
                :$person['status']==='pending'&&strtotime($person['confirmation_expires_at']??'')>time()&&hash_equals($person['confirmation_hash']??'',hash('sha256',$payload['token'])));
        }
        if(!$valid){query("UPDATE email_jobs SET cancelled_at=NOW(),payload=JSON_OBJECT() WHERE id=?",[$job['id']]);continue;}
        query('UPDATE email_jobs SET attempts=attempts+1,available_at=DATE_ADD(NOW(),INTERVAL 15 MINUTE) WHERE id=?',[$job['id']]);
        try{
            [$subject,$html,$plain]=emailTemplate($job['kind'],$person,$payload);
            $mail=new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();$mail->Host=config('SMTP_HOST');$mail->Port=(int)config('SMTP_PORT');
            $mail->SMTPAuth=true;$mail->Username=config('SMTP_USERNAME');$mail->Password=config('SMTP_PASSWORD');
            $mail->SMTPSecure=$mail->Port===465?'ssl':'tls';$mail->Timeout=20;$mail->CharSet='UTF-8';
            $mail->setFrom(config('MAIL_FROM'),'Matcha Mori');$mail->addAddress($job['recipient']);$mail->Subject=$subject;
            $mail->isHTML(true);$mail->Body=$html;$mail->AltBody=$plain;
            if($job['kind']==='member')$mail->addEmbeddedImage(__DIR__.'/assets/member-welcome-background-v2.png','member-welcome-background-v2');
            if($job['kind']==='confirm')$mail->addEmbeddedImage(__DIR__.'/assets/newsletter-hero-v2.png','newsletter-hero-v2');
            if($job['kind']==='newsletter')$mail->addEmbeddedImage(__DIR__.'/assets/newsletter-hero-v2.png','newsletter-hero-v2');
            $mail->MessageID='<matcha-'.$job['id'].'@'.parse_url(config('API_URL'),PHP_URL_HOST).'>';
            $mail->send();query("UPDATE email_jobs SET sent_at=NOW(),payload=JSON_OBJECT() WHERE id=?",[$job['id']]);
            echo 'Sent job '.$job['id'].PHP_EOL;
        }catch(Throwable){fwrite(STDERR,'Failed job '.$job['id']."; will retry up to 5 attempts.\n");}
    }
    query('DELETE FROM rate_limits WHERE expires_at<NOW()');
}finally{query("SELECT RELEASE_LOCK('matcha_mail_worker')");}
