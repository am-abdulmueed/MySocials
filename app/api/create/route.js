import User from "@/models/user";
import { currentUser } from "@clerk/nextjs";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        if (!process.env.NEXT_MONGO_URI) {
            console.error("Missing NEXT_MONGO_URI environment variable");
            return NextResponse.json({ error: "Server misconfiguration: missing database URI." }, { status: 500 });
        }
        await mongoose.connect(process.env.NEXT_MONGO_URI);
        const user = await currentUser();
        if (!user || !user.emailAddresses || !user.emailAddresses[0]) {
            console.error("No current user or missing emailAddresses", user);
            return NextResponse.json({ error: "User authentication failed or missing email." }, { status: 401 });
        }
        const { emailAddresses, imageUrl } = user;
        const email = emailAddresses[0].emailAddress;
        const body = await request.json();
        console.log("Mongo URI:", process.env.NEXT_MONGO_URI);
        console.log("Current user:", email);
        console.log("Incoming body:", body);
        const { username, bio, youtube, insta, face, github, name } = body;

        const findCurrentUser = await User.findOne({ email: email });

        const getSimilarUsername = await User.findOne({ username: username });
        if (getSimilarUsername && getSimilarUsername.email !== email) {
            console.log(getSimilarUsername.email);
            return NextResponse.json({ error: "Username is already in use" }, { status: 500 });
        }

        if (findCurrentUser) {
            await User.findOneAndUpdate(
                { email: email },
                {
                    name: name,
                    username: username,
                    bio: bio,
                    youtube: youtube,
                    instagram: insta,
                    facebook: face,
                    github: github,
                    image: imageUrl
                }
            );
            return NextResponse.json({ message: "success", name, username, bio, youtube, insta, face, github }, { status: 200 });
        } else {
            await User.create({
                name: name,
                username: username,
                bio: bio,
                youtube: youtube,
                instagram: insta,
                facebook: face,
                github: github,
                image: imageUrl,
                email:email
            });
            return NextResponse.json({ message: "success", name, username, bio, youtube, insta, face, github }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
