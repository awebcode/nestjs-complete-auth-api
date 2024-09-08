import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse<FastifyReply>();

    // Check if there's an access token in the cookies
    let accessToken = this.extractAccessTokenFromCookies(request);
    // If no access token or it's expired, check for refresh token
    if (!accessToken || !this.isTokenValid(accessToken)) {
      const refreshToken = this.extractRefreshTokenFromCookies(request);

      if (!refreshToken) {
        throw new UnauthorizedException('No valid access or refresh token provided');
      }

      try {
        // Verify and decode the refresh token
        const refreshTokenPayload = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_SECRET, // Use a separate secret for refresh tokens
        });

        // Generate a new access token using the refresh token's payload
        const newAccessTokenPayload = { userId: refreshTokenPayload.userId, email: refreshTokenPayload.email };
        accessToken = this.jwtService.sign(newAccessTokenPayload, {
          secret: process.env.JWT_SECRET, // Same secret for access tokens
          expiresIn: '1h',
        });

        // Set the new access token in the cookies
        response.setCookie('access_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 60, // 1 hour
          sameSite: 'strict',
        });
      } catch (error) {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }

    try {
      // Verify and decode the access token
      const decoded = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET, // Same secret for access tokens
      });

      // Attach the decoded user information to the request
      request.user = decoded;
      console.log({ decoded })

      return true; // Token is valid, allow access
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  private extractAccessTokenFromCookies(request: FastifyRequest): string | null {
    return request.cookies['access_token'] || request.headers.authorization && request.headers.authorization.split(' ')[1] || null;
  }

  private extractRefreshTokenFromCookies(request: FastifyRequest): string | null {
    return request.cookies['refresh_token'] || null;
  }

  private isTokenValid(token: string): boolean {
    try {
      this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      return true;
    } catch (error) {
      return false;
    }
  }
}
