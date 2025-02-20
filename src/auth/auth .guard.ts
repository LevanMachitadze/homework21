import { th } from '@faker-js/faker/.';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IsAuthGuard implements CanActivate {
  constructor(private jwtServise: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.getTokenFromHeader(request.headers);

      if (!token) throw new BadRequestException('token is not provided');

      const payload = this.jwtServise.verify(token);
      request.userId = payload.userId;
      request.subscription = payload.subscription;

      return true;
    } catch (e) {
      throw new UnauthorizedException('permition denied');
    }
  }
  getTokenFromHeader(headers) {
    const authorization = headers.authorization;
    if (!authorization) return null;
    const [type, token] = authorization.split(' ');
    return type === 'Bearer' && token ? token : null;
  }
}
