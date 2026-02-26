import { useEffect, useState } from 'react';
import {supabase} from "./supabase.js";

export function useSupabaseJwt() {
    const [jwt, setJwt] = useState(null);

    useEffect(() => {
        let active = true;

        supabase.auth.getSession().then(({ data }) => {
            if (active) setJwt(data.session?.access_token ?? null);
        });

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setJwt(session?.access_token ?? null);
        });

        return () => {
            active = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    return jwt;
}