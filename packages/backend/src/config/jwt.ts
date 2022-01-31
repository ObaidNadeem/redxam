import { sign, SignOptions, verify } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  type: 'verified' | 'login';
}

export class JWT {
  private static readonly SIGNATURE = process.env.TOKEN_SECURITY_KEY;
  private static readonly OPTIONS: SignOptions = { expiresIn: '1d' };
  private get key() {
    return JWT.SIGNATURE;
  }
  private get tokenOpts() {
    return JWT.OPTIONS;
  }
  constructor(private data: string | TokenPayload = null) {}
  private isToken(data: string | TokenPayload): data is string {
    return typeof data === 'string';
  }
  public signSync(): string | null {
    if (this.isToken(this.data)) {
      throw new Error('Data is already a token!');
    }

    try {
      return sign(this.data, this.key, this.tokenOpts);
    } catch {
      return null;
    }
  }
  public async sign(): Promise<string | null> {
    return new Promise(res => {
      if (this.isToken(this.data)) {
        throw new Error('Data is already a token!');
      }

      sign(this.data, this.key, this.tokenOpts, (err, encoded) => {
        res(err ? null : encoded);
      });
    });
  }
  public verifySync(): TokenPayload | null {
    if (!this.isToken(this.data)) {
      throw new Error('Data is not a token!');
    }

    try {
      const payload = verify(this.data, this.key);
      return payload as TokenPayload;
    } catch {
      return null;
    }
  }
  public async verify(): Promise<TokenPayload | null> {
    return new Promise(res => {
      if (!this.isToken(this.data)) {
        throw new Error('Data is not a token!');
      }
      verify(this.data, this.key, (err, encoded) => {
        if (err) console.log(err.message);
        res(err ? null : (encoded as TokenPayload));
      });
    });
  }
  private getAuthorizationToken(authorizationHeader: string) {
    const authorization = authorizationHeader?.split(' ');
    if (!authorization) {
      console.debug('No authorization header!');
      return null;
    }

    const [tokenType, token] = authorization;
    if (tokenType !== 'Bearer') {
      console.debug('Invalid token type!');
      return null;
    }

    if (!token) {
      console.debug('No token passed!');
      return null;
    }

    return token;
  }
  public authorizeSync(authorizationHeader: string) {
    this.data = this.getAuthorizationToken(authorizationHeader);
    return this.data ? this.verifySync() : null;
  }
  public async authorize(authorizationHeader: string) {
    this.data = this.getAuthorizationToken(authorizationHeader);
    return this.data ? this.verify() : null;
  }
}
