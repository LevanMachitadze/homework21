import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { Observable } from 'rxjs';

export class HasUserIdGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['user-id'];
    if (!userId || !isValidObjectId(userId)) {
      throw new BadRequestException('invalid Id');
    }
    request.userId = userId;

    return true;
  }
}
