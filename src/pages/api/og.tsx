import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handler() {
  const sourceSerifMedium = await fetch(
    new URL("../../../public/fonts/SourceSerif4-Medium.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const sourceSerifMediumItalic = await fetch(
    new URL(
      "../../../public/fonts/SourceSerif4-MediumItalic.ttf",
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  const sourceSerifBold = await fetch(
    new URL("../../../public/fonts/SourceSerif4-Bold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "white",
          fontFamily: "SourceSerif4",
        }}
      >
        <div tw="m-12 p-12 flex-1 bg-stone-50 flex flex-col justify-center border border-gray-500">
          <h1 tw="text-8xl tracking-tight m-0">Strand</h1>
          <h3 tw="font-bold tracking-tight text-4xl tracking-tight m-0 mt-2 text-gray-500">
            Daily, crowdsourced storytelling with strangers
          </h3>
          <p tw="text-2xl text-gray-500">Join for free today</p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          data: sourceSerifMedium,
          name: "SourceSerif4",
          style: "normal",
          weight: 400,
        },
        {
          data: sourceSerifMediumItalic,
          name: "SourceSerif4",
          style: "italic",
          weight: 400,
        },
        {
          data: sourceSerifBold,
          name: "SourceSerif4",
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
