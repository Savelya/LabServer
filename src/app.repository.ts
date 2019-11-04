import { Injectable } from '@nestjs/common';
const fs = require("fs");

@Injectable()
export class AppRepository { 
  private users: IUser[] = [];
  private readonly loginToId: Map<string, string> = new Map();
  private readonly shortLinkToLong: Map<string, string> 
    = new Map();
  private codes: ICode[] = [];

  constructor(){
    const content = fs.readFile("users.json", (er, data) => {
      this.users = JSON.parse(data);
    });
   
    const cod = fs.readFile("codes.json", (er, data) => {
      this.codes = JSON.parse(data);
    });
    
  }


  async getUserByLogin(login: string): Promise<IUser | undefined> {
    return this.users.find(user => user.login === login);
  }

  async getUser(userData: IUser): Promise<IUser | undefined> {
    return this.users.find(user => {
      return (user.login === userData.login) && 
        (user.password === userData.password);
    });
  }

  async saveUser(user: IUser): Promise<void> {
    this.users.push(user);
    fs.writeFile("users.json", JSON.stringify(this.users));
  }

  async saveCode(icode: ICode): Promise<void> {
    this.codes.push(icode);
    fs.writeFile("codes.json", JSON.stringify(this.codes));
  }

  async sendCode(): Promise<ICode[]> {
    return this.codes;
  }

  async saveId(login: string, id: string): Promise<void> {
    this.loginToId.set(login, id);
  }

  async idExists(id: string): Promise<boolean> {
    const values = Array.from(this.loginToId.values());
    return values.includes(id);
  }

  async loginOnline(login: string): Promise<boolean> {
    const keys = Array.from(this.loginToId.keys());
    return keys.includes(login);
  }

  async saveLink(longLink: string, shortLink: string): Promise<void> {
    this.shortLinkToLong.set(shortLink, longLink);
  }

  async findLongLink(shortLink: string): Promise<string | undefined> {
    return this.shortLinkToLong.get(shortLink);
  }
}

interface IUser {
  login: string;
  password: string;
}

interface ICode {
  login: string;
  code: string;
}