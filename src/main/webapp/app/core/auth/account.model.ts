export class Account {
  public activated: boolean = true;
    public authorities: string[] = [];
    public email: string = "";
    public firstName: string | null = null;
    public langKey: string = "";
    public lastName: string | null = null;
    public login: string = "";
    public imageUrl: string | null = null;
    public id: string | null = null;
  // constructor(
    
  // ) {}

  constructor(data: Partial<Account>) {
    // const defaultValues: Account = {
    //   title: 'Default Title',
    //   content: 'Default Content',
    // };

    // Use Object.assign to merge default values with provided data
    Object.assign(this, data);
  }
}
