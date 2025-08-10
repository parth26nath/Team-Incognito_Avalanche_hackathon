import { Subscribe } from "../sections/subscribe";

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl md:text-7xl font-medium tracking-tight mb-16 text-center">
        Coming
        <span className="bg-gradient-to-r from-[#FEBF5D] to-[#FFA2C9] text-transparent bg-clip-text">
          {" "}Soon!
        </span>
      </h1>
      <Subscribe />
    </div>
  );
};

export default ComingSoon;
