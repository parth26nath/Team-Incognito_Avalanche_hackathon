'use client'

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Button } from "../ui/button";
import Image from 'next/image';

export function Subscribe() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    emailjs.send(
      'service_tz0ljpz', 
      'service_kfx2iuv', 
      {
        to_email: 'bhurva@heartly.live',
        from_email: email,
        message: `New subscription request from ${email}`
      },
      'Jrhg4wXvrc5GPgI0E' 
    )
    .then(() => {
      setEmail('');
      alert('Thanks for subscribing!');
    });
  };

  return (
    <section id="mail" className="py-24 px-4 sm:px-8 md:px-16">
      <div className="container mx-auto flex flex-row items-center justify-between gap-12">
        <div className="flex flex-col max-w-xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-left leading-tight">
            Stay{" "}
            <span className="bg-gradient-to-r from-[#FEBF5D] to-[#FFA2C9] text-transparent bg-clip-text">
              Mindful.
            </span>{" "}
            Stay Updated!
          </h2>
          <p className="text-lg mt-4 font-normal">
          Listening is the first step to understanding. Join our listener community today and be a voice of comfort and support.
          </p>
          <div className='my-4'>
          <Button 
              onClick={handleSubscribe}
              className="bg-gradient-to-r from-[#FEBF5D] to-[#FFA2C9] text-white px-6 py-2 rounded-lg"
            >
              Become a Listener Today
            </Button>
          </div>
            
        
        </div>
        
        
        <div className="hidden md:block">
          <Image
            src="/mail.gif"
            alt="Subscribe animation"
            width={400}
            height={400}
            className="rounded-3xl"
            unoptimized={true}
          />
        </div>
      </div>
    </section>
  );
}
