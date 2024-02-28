import clsx from "clsx";
import { ActivitySquare } from "lucide-react";



export function LogoIcon() {
  return (
    <ActivitySquare className="text-white h-7 w-7" />
  );
}




export function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <>
      <div
        className={clsx(
          "flex flex-none items-center justify-center border border-neutral-200 dark:border-neutral-700 dark:bg-white bg-black",
          {
            "h-[40px] w-[40px] rounded-xl": !size,
            "h-[30px] w-[30px] rounded-lg": size === "sm",
          }
        )}
      >
        <LogoIcon />
      </div>
      {/* <div className="ml-2 flex-none text-base font-medium uppercase lg:block">7WEST</div> */}
      <span className="ml-3 text-xl">USA Health Visualization</span>
    </>

  );
}
