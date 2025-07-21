declare module "*.svg?react" {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  // eslint-disable-next-line import/no-default-export
  export default ReactComponent;
}
