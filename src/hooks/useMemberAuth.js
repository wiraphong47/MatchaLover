import { useEffect, useRef, useState } from "react";
import { authMessage, getMemberSession, loginMember, logoutMember, registerMember, saveMember } from "../services/memberService";

export default function useMemberAuth() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    getMemberSession()
      .then((result) => mounted.current && setCustomer(result.customer))
      .catch((failure) => mounted.current && setError(authMessage(failure)))
      .finally(() => mounted.current && setLoading(false));
    return () => { mounted.current = false; };
  }, []);
  const login = async (credentials) => {
    const result = await loginMember(credentials); setCustomer(result.customer); setError(""); return result;
  };
  const register = async (form) => {
    const result = await registerMember(form); setCustomer(result.customer); setError(""); return result;
  };
  const logout = async () => { await logoutMember(); setCustomer(null); setError(""); };
  const save = async (form) => { const profile = await saveMember(null, form); setCustomer(profile); return profile; };
  return { customer, loading, error, isLoggedIn: Boolean(customer), login, logout, register, save };
}
