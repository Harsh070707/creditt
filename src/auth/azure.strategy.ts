import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { VerifiedCallback } from 'passport-jwt';
import { config } from 'dotenv';
import { Request } from 'express-serve-static-core';

config();

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor() {
    super({
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_SECRET,
      resource: process.env.MICROSOFT_RESOURCE,
      tenant: process.env.MICROSOFT_TENANT,
      callbackURL: process.env.MICROSOFT_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['user.read'],
      prompt: 'select_account',
    });
  }

  authorizationParams(options: any): any {
    return Object.assign(options, {
      propmt: 'select_account',
    });
  }

  authenticate(req: Request, option) {
    option.prompt = 'select_account';
    if (req.query?.invitedToken) {
      option.state = `${req.headers.host}|${req.query.invitedToken}`;
      super.authenticate(req, option);
    } else {
      option.state = req.headers.host;
      super.authenticate(req, option);
    }
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifiedCallback,
  ): Promise<any> {
    const jsonProfile = (profile && profile._json) || {};

    const user = {
      firstName: jsonProfile.givenName,
      lastName: jsonProfile.surname,
      email: jsonProfile.userPrincipalName,
      access_token: accessToken,
      picture: null,
    };

    done(null, user);
  }
}
