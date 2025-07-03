"use client";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UserPageLink() {
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (!username) {
            fetch("/api/get")
                .then(async res => {
                    const text = await res.text();
                    console.log("Raw response text (UserPageLink):", text);
                    if (!res.ok) {
                        console.warn(`API failed (${res.status}): ${text}`);
                        return null;
                    }
                    try {
                        const data = JSON.parse(text);
                        console.log("Parsed JSON (UserPageLink):", data);
                        return data;
                    } catch (err) {
                        console.error("Invalid JSON (UserPageLink):", err.message, text);
                        return null;
                    }
                })
                .then(data => {
                    if (!data) return;
                    if (data && data.data) {
                        setUsername(data.data.username);
                    } else {
                        setShow(true);
                        console.warn("Username not found in response:", data);
                    }
                    setShow(true);
                });
        }
    });

    return (
        <div className="px-6 md:px-20 lg:px-32">
            {!username ? (
                <Alert className="p-3">
                    <AlertTitle className="text-sm"><span>✨</span> Heads up <span>✨</span></AlertTitle>
                    <AlertDescription className="text-xs text-gray-600 dark:text-gray-400">
                        Scroll down to publish your page to get your personalized page link!
                    </AlertDescription>
                </Alert>
            ) : (
                <div>
                  <Alert className="p-3">
                    <AlertTitle className="text-sm"><span>✨</span> Your page is ready <span>✨</span></AlertTitle>
                    <AlertDescription className="text-xs text-gray-600 dark:text-gray-400 hover:underline">
                        <Link target="_blank" href={`https://${location.host}/${username}`}>https://{location.host}/{username}</Link>
                    </AlertDescription>
                </Alert>  
                </div>
            )}
        </div>
    );
}