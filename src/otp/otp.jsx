import { useState, useRef } from "react";
import "./style.css";

const TempArray = ["🌳", "🫡", "🕵️‍♂️", "🤡"];

function OTP({ count, onOTPComplete }) {
  const [otps, setOtps] = useState(new Array(count).fill(""));
  const [masking, setMasking] = useState(new Array(count).fill(""));

  const inputRefs = useRef([]);

  function handlePaste(index) {
    return (event) => {
      // TODO: manage it for index > 0
      const pastedData = event.clipboardData.getData("Text").slice(0, 4);
      if (!isNaN(pastedData)) {
        console.log(pastedData);
        setOtps(pastedData.split(""));
        setMasking(TempArray);
      }
    };
  }

  function handleClick(index) {
    return (event) => {
      event.target.setSelectionRange(1, 1);
    };
  }

  function handleKeyUp(index) {
    return (event) => {
      const key = event.key;

      console.log(key);

      const oldOtps = [...otps];
      const maskingCopy = [...masking];

      // handle backspace
      if (key === "Backspace") {
        oldOtps[index] = "";
        maskingCopy[index] = "";

        moveFocusToLeft(index);

        setOtps(oldOtps);
        setMasking(maskingCopy);
        return;
      }

      if (key === "ArrowRight") {
        moveFocusToRight(index, oldOtps);
        return;
      }

      if (key === "ArrowLeft") {
        moveFocusToLeft(index);
        return;
      }

      if (isNaN(key)) {
        return;
      }

      oldOtps[index] = key;
      maskingCopy[index] = TempArray[index];
      setMasking(maskingCopy);

      setOtps(oldOtps);
      moveFocusToRight(index);

      const otpToSend = oldOtps.join("");
      if (otpToSend.length === count) {
        onOTPComplete(otpToSend);
      }
    };
  }

  function moveFocusToRight(index, oldOtps) {
    // Send focus to next box if box is available

    if (inputRefs.current[index + 1]) {
      if (oldOtps) {
        //         Guy’s one correction to yesterday code. in function moveFocusToRight,

        // We had used slice to trim array, but it will not work. because we are trimming our original array, and if in original array empty string it at index 3, after trmiing it might come at 1, or 2.

        // To fix this we can use original array, and we will simply fill the values before index with any random value other than empty string, so that we always get matach in right direction.

        // Here is how we will do it:
        // previous
        //     const trimedArray = otps.slice(index);

        // Now:
        //   const tempArray = [...otps];
        //   const trimedArray = tempArray.fill("*", 0, index);
        // const trimedArray = otps.slice(index);

        const tempArray = [...otps];
        const trimedArray = tempArray.fill("*", 0, index);
        // find the index of empty box
        const emptyIndex = trimedArray.indexOf("");
        inputRefs.current[emptyIndex]?.focus();
      } else {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }

  function moveFocusToLeft(index) {
    // Move focus back, if box is there
    if (inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  console.log(otps);

  return (
    <div>
      {new Array(count).fill("").map((_, index) => {
        return (
          <input
            ref={(iRef) => {
              inputRefs.current[index] = iRef;
            }}
            onChange={(event) => {
              const selectedData = event.target.value;
              if (selectedData.length === count) {
                if (!isNaN(selectedData)) {
                  console.log(selectedData);
                  setOtps(selectedData.split(""));
                  setMasking(TempArray);
                }
              }
            }}
            // maxLength={1}
            inputMode="numeric"
            autoComplete="one-time-code"
            onPaste={handlePaste(index)}
            onKeyUp={handleKeyUp(index)}
            onClick={handleClick(index)}
            key={index}
            type="text"
            value={masking[index] ?? ""}
          />
        );
      })}
    </div>
  );
}

export default OTP;
