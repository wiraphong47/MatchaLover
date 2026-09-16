import { useEffect, useState } from "react";
import useAsyncAction from "./useAsyncAction";
import {
  selectedInterestKeys,
  toggleInterestNote,
} from "../utils/matchaInterests";

const emptyForm = () => ({
  name: "",
  password: "",
  email: "",
  phone: "",
  address: "",
  note: "",
  consent: false,
});

export default function useCustomerForm({ open, customer, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [validationError, setValidationError] = useState("");
  const { run, busy, error, clearError } = useAsyncAction(onSave);
  const needsCredentials = !customer;
  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm(), ...customer });
      setValidationError("");
    }
  }, [open, customer]);
  const change = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));
  const setConsent = (value) =>
    setForm((current) => ({ ...current, consent: value }));
  const toggleInterest = (key) =>
    setForm((current) => ({
      ...current,
      note: toggleInterestNote(current.note, key),
    }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.name || !form.phone) {
      setValidationError("กรุณากรอกอีเมล ชื่อผู้รับ และเบอร์โทรศัพท์ให้ครบ");
      return;
    }
    if (needsCredentials && form.password.length < 8) {
      setValidationError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }
    if (needsCredentials && !form.consent) {
      setValidationError("กรุณากดยินยอมให้จัดเก็บข้อมูลสมาชิกก่อนสมัคร");
      return;
    }
    setValidationError("");
    if (await run(form)) onClose();
  };
  return {
    form,
    change,
    setConsent,
    toggleInterest,
    selectedInterests: selectedInterestKeys(form.note),
    submit,
    busy,
    error: validationError || error,
    clearError: () => {
      setValidationError("");
      clearError();
    },
    needsCredentials,
  };
}
