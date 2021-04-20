# NOTE: This script was used for encoding the SSL certificate files to base64
# so they could be used as environment variables for TypeORM configuration.

import base64
import os

SSL_CA_PATH = '../conf/ssl/api-service/server-ca.pem'
SSL_CERT_PATH = '../conf/ssl/api-service/client-cert.pem'
SSL_KEY_PATH = '../conf/ssl/api-service/client-key.pem'

GCLOUD_CREDENTIALS_PATH = '../conf/gcloud/gcloud-api.json'

def to_base_64(filepath: str) -> str:
    script_dir = os.path.dirname(__file__)
    path = os.path.join(script_dir, filepath) 

    in_file = open(path, 'rb')
    data_raw = in_file.read()
    in_file.close()

    data_encoded = base64.b64encode(data_raw)

    print(f"Encoding for \"{path}\":")
    print(f"{data_encoded.decode('utf-8')}\n")

    return data_encoded

def main():
    gcloud_credentials = to_base_64(GCLOUD_CREDENTIALS_PATH)

if __name__ == '__main__':
    main()
