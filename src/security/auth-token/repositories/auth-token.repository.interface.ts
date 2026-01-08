// Token management is based on user_session table
// This interface provides token-specific queries
export interface TokenInfo {
  sessionId: number;
  sessionUuid: string;
  actorId: number;
  actorType: string;
  tokenHash: string; // Hashed token (never plain text)
  expiresAt: Date;
  isActive: boolean;
  lastActivity: Date;
}

export interface IAuthTokenRepository {
  findByTokenHash(tokenHash: string): Promise<TokenInfo | null>;
  findActiveTokensByActorId(actorId: number): Promise<TokenInfo[]>;
  findExpiredTokens(): Promise<TokenInfo[]>;
  findRevokedTokens(): Promise<TokenInfo[]>;
}
