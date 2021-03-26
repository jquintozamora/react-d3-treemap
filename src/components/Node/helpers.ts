let canvas;
export const getTextDimensions = (
  text: string,
  style: React.CSSProperties = {
    fontVariant: "normal",
    fontWeight: "normal",
    fontSize: 14,
    fontFamily: "Arial",
  }
) => {
  // re-use canvas object for better performance
  if (!canvas) {
    canvas = document.createElement("canvas");
  }
  var context = canvas.getContext("2d");
  const { fontVariant, fontWeight, fontSize, fontFamily } = style;
  const heightSpacingAround = 2;
  const height = Number(fontSize) + heightSpacingAround;
  if (context) {
    context.font = `${fontVariant} ${fontWeight} ${fontSize}px '${fontFamily}'`;
    return {
      width: Number(context.measureText(text).width),
      height,
    };
  } else {
    return { width: 0, height };
  }
};

const charWidthCache: Record<string, number> = {};
export const truncateText = (
  text: string,
  style: React.CSSProperties,
  maxWidth: number,
  ellipsis: string = "..."
) => {
  const cachedCharWidth = (char: string) => {
    const cached = charWidthCache[char];
    if (cached !== undefined) {
      return cached;
    }
    const charWidth = getTextDimensions(char, style).width;
    charWidthCache[char] = charWidth;
    return charWidth;
  };

  const truncatedChars: string[] = [];
  const charArray = Array.from(text);

  const ellipsisWidth = cachedCharWidth(ellipsis);
  if (maxWidth - ellipsisWidth < 0) {
    return text.charAt(0);
  }

  let currentWidth = ellipsisWidth;
  let didTruncate = false;
  for (let i = 0; i < charArray.length; i++) {
    const charWidth = cachedCharWidth(charArray[i]);
    if (currentWidth + charWidth <= maxWidth) {
      truncatedChars[i] = charArray[i];
      currentWidth += charWidth;
    } else {
      truncatedChars[i] = ellipsis;
      didTruncate = true;
      break;
    }
  }

  if (didTruncate) {
    return truncatedChars.join("");
  }

  return text;
};

export const getNumberItemsWidthByNumberOfChars = (
  fontSize: number,
  numberOfChars: number
) => {
  return (fontSize / 2) * numberOfChars + 5;
};
