import * as Firebase from "firebase";


export interface UserProperties {
  readonly email: string;
  readonly displayName?: string;
  readonly photoUrl?: string;
}

export default class User implements UserProperties {

  readonly email: string;

  readonly displayName?: string;

  readonly photoUrl?: string;

  constructor(props: UserProperties) {
    this.email = props.email;
    this.displayName = props.displayName;
    this.photoUrl = props.photoUrl;
  }
}

export class FirebaseUser extends User {

  constructor(user: Firebase.User) {
    super({email: user.email, displayName: user.displayName, photoUrl: user.photoURL});
  }
}