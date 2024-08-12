export interface SendMail<CTX extends {} = {}> {
  to: string;
  subject: string;
  template: string;
  context?: CTX;
}
