import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite que React se conecte desde Vercel

# Configuración de la Base de Datos
# Si estás en local, usará una base de datos SQLite de prueba (app.db), 
# pero en Render usará la PostgreSQL real de forma automática.
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URL_KEY'] = DATABASE_URL # Para compatibilidad interna
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# -----------------------------------------------------------------
# MODELOS DE LA BASE DE DATOS (Tablas)
# -----------------------------------------------------------------

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False) # En el futuro usaremos hash por seguridad

class Producto(db.Model):
    __tablename__ = 'productos'
    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(50), unique=True, nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)


def usuario_a_dict(usuario):
    return {
        "id": usuario.id,
        "username": usuario.username,
    }


def producto_a_dict(producto):
    return {
        "id": producto.id,
        "codigo": producto.codigo,
        "nombre": producto.nombre,
        "precio": producto.precio,
        "stock": producto.stock,
    }

# Crear las tablas automáticamente si no existen
with app.app_context():
    db.create_all()

# -----------------------------------------------------------------
# ENDPOINTS (Rutas de la API)
# -----------------------------------------------------------------

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({
            "success": False,
            "message": "Debes enviar username y password"
        }), 400

    # Buscar el usuario en PostgreSQL
    usuario_encontrado = Usuario.query.filter_by(username=username).first()

    if usuario_encontrado and usuario_encontrado.password == password:
        return jsonify({
            "success": True, 
            "message": "Login correcto",
            "usuario": usuario_a_dict(usuario_encontrado)
        }), 200
    else:
        return jsonify({"success": False, "message": "Usuario o contraseña incorrectos"}), 401


@app.route('/api/productos/<codigo>', methods=['GET'])
def buscar_producto(codigo):
    # Buscar el producto por su código en PostgreSQL
    producto = Producto.query.filter_by(codigo=codigo).first()

    if producto:
        return jsonify({
            "success": True,
            "producto": {
                "codigo": producto.codigo,
                "nombre": producto.nombre,
                "precio": producto.precio,
                "stock": producto.stock
            }
        }), 200
    else:
        return jsonify({"success": False, "message": "Producto no encontrado"}), 404


@app.route('/api/productos', methods=['GET'])
def listar_productos():
    productos = Producto.query.order_by(Producto.nombre.asc()).all()

    return jsonify({
        "success": True,
        "total": len(productos),
        "productos": [producto_a_dict(producto) for producto in productos],
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)