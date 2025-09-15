
export enum Author {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  id: string;
  text: string;
  author: Author;
}
