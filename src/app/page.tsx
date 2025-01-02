import CallNotification from "@/components/CallNotification";
import OnlineUsersList from "@/components/OnlineUsersList";
import VideoCall from "@/components/VideoCall";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between gap-8 bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <OnlineUsersList />
      <CallNotification />
      <VideoCall />
    </div>
  );
}
