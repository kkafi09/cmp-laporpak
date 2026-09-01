import argparse
import getpass
import uuid
from app.auth import hash_password
from app.db.database import SessionLocal
from app.db.models import User

def create_admin():
    parser = argparse.ArgumentParser()
    parser.add_argument("--username", required=True)
    parser.add_argument("--name", required=True)
    parser.add_argument("--email", required=True)
    parser.add_argument("--nip", default=None)
    args = parser.parse_args()
    password = getpass.getpass("Password admin: ")
    db = SessionLocal()
    try:
        if db.query(User).filter(User.username == args.username).first():
            raise SystemExit("Username sudah digunakan")
        db.add(User(id=f"usr-{uuid.uuid4().hex}", username=args.username, name=args.name, email=args.email, nip=args.nip, role="ADMIN_ASN", password_hash=hash_password(password)))
        db.commit()
    finally:
        db.close()
    print("Admin berhasil dibuat")

if __name__ == "__main__":
    create_admin()
