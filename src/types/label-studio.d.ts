declare module 'label-studio' {
  export default class LabelStudio {
    constructor(container: HTMLElement, options: {
      config: string;
      interfaces: string[];
      task: {
        data: {
          image?: string;
          text?: string;
        };
        annotations: any[];
        predictions: any[];
        config: string;
      };
      onLabelStudioLoad?: (LS: any) => void;
      onSubmit?: (LS: any, annotation: any) => void;
    });
  }
} 