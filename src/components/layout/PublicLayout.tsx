import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedOutlet from "@/components/AnimatedOutlet";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatedOutlet />
      </main>
      <Footer />
    </div>
  );
}
