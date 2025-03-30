import "./loading.css";

type Props = {
  theme: "light" | "dark";
};

export const LoadingSpinner = (props: Props) => {
  const theme = props.theme;
  return (
    <span
      className={`loading-spinner ${
        theme === "dark"
          ? "border-neutral-800 border-b-neutral-100"
          : "border-neutral-100 border-b-orange-700"
      }`}
    ></span>
  );
};

export const TripleLoadingSpinner = () => {
  return <span className="triple-loading-spinner"></span>;
};

export const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <div>
        <TripleLoadingSpinner />
      </div>
    </div>
  );
};
