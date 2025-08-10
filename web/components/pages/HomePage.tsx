import React from "react";
import { Hero } from "@/components/sections/Home";
import { Features } from "../sections/Feature";
import { Experience } from "../sections/experience";
import { Footer } from "../sections/footer";
import { Subscribe } from "../sections/subscribe";
import { What } from "../sections/what";
import { Listener } from "../sections/Listener";

const HomePage = () => {
  return (
    <div className="mx-auto">
      <Hero />
      <What/>
      <Features />
      <Experience />
      <Listener />
      <Subscribe/>
      <Footer />
    </div>
  );
};

export default HomePage;
