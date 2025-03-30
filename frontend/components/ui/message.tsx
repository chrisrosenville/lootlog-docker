import { VscError, VscInfo, VscWarning } from "react-icons/vsc";
import { IoMdCheckmark } from "react-icons/io";

type Props = {
  type: "error" | "warning" | "info" | "success";
  message: string;
};
export const Message = ({ type, message }: Props) => {
  switch (type) {
    case "error":
      return (
        <div className="flex w-fit items-center place-self-center rounded-md bg-red-100 p-2">
          <VscError className="fill-red-500 text-lg" />
          <p className="ml-2 text-sm text-red-600">{message}</p>
        </div>
      );
    case "warning":
      return (
        <div className="flex w-fit items-center place-self-center rounded-md bg-yellow-100 p-2">
          <VscWarning className="fill-yellow-500 text-lg" />
          <p className="ml-2 text-sm text-yellow-500">{message}</p>
        </div>
      );
    case "info":
      return (
        <div className="flex w-fit items-center place-self-center rounded-md bg-red-100 p-2">
          <VscInfo className="fill-blue-500 text-lg" />
          <p className="ml-2 text-sm text-blue-500">{message}</p>
        </div>
      );
    case "success":
      return (
        <div className="flex w-fit items-center place-self-center rounded-md bg-red-100 p-2">
          <IoMdCheckmark className="fill-green-500 text-lg" />
          <p className="ml-2 text-sm text-green-500">{message}</p>
        </div>
      );
    default:
      return (
        <div className="flex w-fit items-center place-self-center rounded-md bg-neutral-100 p-2">
          <p className="text-sm text-neutral-950">{message}</p>
        </div>
      );
  }
};
