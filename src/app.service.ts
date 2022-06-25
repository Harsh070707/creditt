import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  serverRunning(): string {
    return `Server running on port ${process.env.PORT} !`;
  }
}
