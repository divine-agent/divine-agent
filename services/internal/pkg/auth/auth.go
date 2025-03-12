package auth

import (
	"crypto/rsa"
	"encoding/base64"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func ParsePrivateKey(encodedPrivateKey string) (*rsa.PrivateKey, error) {
	decodedPrivateKey, err := base64.StdEncoding.DecodeString(encodedPrivateKey)
	if err != nil {
		return nil, err
	}
	key, err := jwt.ParseRSAPrivateKeyFromPEM(decodedPrivateKey)
	if err != nil {
		return nil, err
	}
	return key, nil
}

func ParsePublicKey(encodedPublicKey string) (*rsa.PublicKey, error) {
	decodedPublicKey, err := base64.StdEncoding.DecodeString(encodedPublicKey)
	if err != nil {
		return nil, err
	}
	key, err := jwt.ParseRSAPublicKeyFromPEM(decodedPublicKey)
	if err != nil {
		return nil, err
	}
	return key, nil
}

func ParseUserId(token *jwt.Token) (uuid.UUID, error) {
	return uuid.Parse(token.Claims.(jwt.MapClaims)["user_id"].(string))
}
