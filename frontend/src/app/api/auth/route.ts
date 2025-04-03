import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Signup Route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, action } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (action === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(
        { message: "Signup successful", user: data.user },
        { status: 200 }
      );
    }

    if (action === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      return NextResponse.json(
        {
          message: "Login successful",
          user: {
            id: data.user?.id,
            email: data.user?.email,
            full_name: data.user?.user_metadata?.full_name || "User",
            phone: data.user?.user_metadata?.phone || "",
          },
          session: data.session,
        },
        { status: 200 }
      );
    }

    if (action === "logout") {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return NextResponse.json({ error: "Logout failed." }, { status: 500 });
      }

      return NextResponse.json({ message: "Logout successful" }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
