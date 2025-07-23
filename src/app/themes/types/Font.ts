export interface FontStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
}

export interface Font {
  h1: FontStyle;
  h2: FontStyle;
  body1: FontStyle;
  body2: FontStyle;
  button: FontStyle;
  caption: FontStyle;
}
