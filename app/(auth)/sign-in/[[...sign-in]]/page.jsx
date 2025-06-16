import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="size-full flex justify-center items-center">
      <SignIn />
    </div>
  );
}
