export const Welcome = () => {
  return (
    <div className="w-full rounded-md bg-neutral-800 p-8">
      <p className="mb-4 text-center font-lato text-xs font-bold uppercase tracking-[0.2em] text-orange700">
        Welcome to Lootlog
      </p>
      <div className="flex flex-col items-center text-center leading-tight">
        <p className="font-lato text-lg font-bold uppercase tracking-widest">
          The latest news in the world of gaming
        </p>
        <p className="hidden font-openSans text-sm font-thin md:block">
          Stay up-to-date by signing up for our newsletter below.
        </p>
      </div>
    </div>
  );
};
