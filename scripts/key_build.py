#!/usr/bin/env python
"""Generate a RS256 key pair for JWT signing and verification."""

from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import base64


# Generate a private key using RSA 2048
private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)

# Serialize the private key to DER format
private_pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.TraditionalOpenSSL,
    encryption_algorithm=serialization.NoEncryption(),
)

# Base64 encode the DER private key
private_b64 = base64.b64encode(private_pem).decode("utf-8")

# Get the corresponding public key
public_key = private_key.public_key()

# Serialize the public key to DER format
public_der = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo,
)

# Base64 encode the DER public key
public_b64 = base64.b64encode(public_der).decode("utf-8")

# Print the Base64 encoded keys
print("Private Key (Base64):")
print(private_b64)
print("\nPublic Key (Base64):")
print(public_b64)

# Notice: The private key should be kept secret and never shared
# with unauthorized parties. The public key can be shared with
# anyone for verification purposes.
print(
    "\n!!! Notice: The private key should be kept secret and never shared with unauthorized parties."
)
print("!!! Notice: Please keep the private key in a secure location.")
