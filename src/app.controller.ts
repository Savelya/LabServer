import { Controller, Get, Post, Body, BadRequestException, Param, Response } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log(this.appService);
  }

  validateUserData(data: any) {
    if (!data.login) {
      throw new BadRequestException({
        ok: false,
        error: 'login required',
      });
    }

    if (!data.password) {
      throw new BadRequestException({
        ok: false,
        error: 'password required',
      });
    }
  }

  @Post('code')
  async getCode(@Body() data) {
    if (!data.code) {
      throw new BadRequestException({
        ok: false,
        error: 'code required',
      });
    }
    if (!data.login) {
      throw new BadRequestException({
        ok: false,
        error: 'login required',
      });
    }
    await this.appService.getCode(data);

    return {
      ok: true,
    };
  }

  @Get('code')
  async sendCode(){
    return this.appService.sendCode();
  }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/api/register')
  async register(@Body() data) {
    this.validateUserData(data);

    await this.appService.register(data);

    return {
      ok: true,
    };
  }

  @Post('/api/login')
  async login(@Body() data) {
    this.validateUserData(data);

    const id = await this.appService.login(data);
    return { id };
  }

  validateUrlCreateData(data: any) {
    if (!data.id) {
      throw new BadRequestException({
        ok: false,
        error: 'id required',
      });
    }

    if (!data.url) {
      throw new BadRequestException({
        ok: false,
        error: 'url required',
      });
    }
  }

  @Post('/api/urls')
  async createLink(@Body() data) {
    this.validateUrlCreateData(data);
    const link = await this.appService.createLink(data);
    return { link };
  }

  @Get(':linkId')
  async redirect(@Param('linkId') linkId, @Response() response) {
    const longLink = await this.appService.getLongLink(linkId);
    response.redirect(longLink);
  }

  // @Post('/name')
  // getName(): string {
  //   return 'name';
  // }
}


interface ICode {
  login: string;
  code: string;
}