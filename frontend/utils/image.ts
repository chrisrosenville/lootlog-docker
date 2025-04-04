"use client";

// export async function resizeImage(image: File): Promise<Blob | null> {
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const img = new Image();
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");
//         if (ctx) {
//           const MAX_WIDTH = 1300;
//           const MAX_HEIGHT = 731.25;
//           let width = img.width;
//           let height = img.height;

//           if (width > height) {
//             if (width > MAX_WIDTH) {
//               height *= MAX_WIDTH / width;
//               width = MAX_WIDTH;
//             }
//           } else {
//             if (height > MAX_HEIGHT) {
//               width *= MAX_HEIGHT / height;
//               height = MAX_HEIGHT;
//             }
//           }

//           canvas.width = width;
//           canvas.height = height;

//           ctx.drawImage(img, 0, 0, width, height);

//           canvas.toBlob((blob) => {
//             const resizedImage = new File([blob!], image.name, {
//               type: image.type,
//               lastModified: Date.now(),
//             });
//             resolve(resizedImage);
//           }, image.type);
//         } else {
//           resolve(null);
//         }
//       };
//       img.src = event.target?.result as string;
//     };
//     reader.readAsDataURL(image);
//   });
// }

// Function to resize an image and return the result as a canvas
export async function resizeImage(
  image: File,
): Promise<HTMLCanvasElement | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const MAX_WIDTH = 1300;
          const MAX_HEIGHT = 731.25;
          let width = img.width;
          let height = img.height;

          // Calculate the resized dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          // Set the canvas to the new dimensions and draw the image on it
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas);
        } else {
          resolve(null);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(image);
  });
}

// Function to convert a canvas to a Blob
export async function convertCanvasToBlob(
  canvas: HTMLCanvasElement,
  imageType: string = "image/png",
  imageName: string = "resized-image",
): Promise<File | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const resizedImage = new File([blob], imageName, {
          type: imageType,
          lastModified: Date.now(),
        });
        resolve(resizedImage);
      } else {
        resolve(null);
      }
    }, imageType);
  });
}
