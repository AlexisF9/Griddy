import { InfoIcon } from "lucide-react";

function Info({ text }: { text: string }) {
  return (
    <>
      <p className="c-info u-text-default">
        <InfoIcon /> {text}
      </p>
    </>
  );
}

export default Info;
