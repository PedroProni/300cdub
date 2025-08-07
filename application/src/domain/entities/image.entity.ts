export class ImageEntity {
  private image_url: string;
  private position: number;

  constructor(props: { image_url: string; position: number }) {
    this.image_url = props.image_url;
    this.position = props.position;
  }

  // Getters
  getImageUrl(): string {
    return this.image_url;
  }

  getPosition(): number {
    return this.position;
  }
}
