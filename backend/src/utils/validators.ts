import isEmail from 'validator/lib/isEmail';
import { IProduct } from '../interfaces/product';
type Result = { valid: boolean; reasons: string[] };

export function validatePassword(
  value: string,
  { email, name }: { email?: string; name?: string } = {}
): Result {
  const reasons: string[] = [];
  if (!value || value.length < 10)
    reasons.push('Debe tener al menos 10 caracteres.');
  if (email && value.toLowerCase().includes(email.split('@')[0].toLowerCase()))
    reasons.push('No puede contener tu email.');
  if (name && value.toLowerCase().includes(name.toLowerCase()))
    reasons.push('No puede contener tu nombre.');
  // simple checks for sequences/repeats
  if (/(0123|1234|abcd|qwerty)/i.test(value))
    reasons.push('No usar secuencias comunes.');
  if (/^(.)\1{3,}$/.test(value))
    reasons.push('No usar muchos caracteres repetidos.');
  // simple complexity suggestion (no hard rejection)
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].reduce(
    (s, rx) => s + (rx.test(value) ? 1 : 0),
    0
  );
  if (classes < 3)
    reasons.push(
      'Usa una mezcla de mayúsculas, minúsculas, números y símbolos.'
    );
  return { valid: reasons.length === 0, reasons };
}

export async function validateEmail(email: string): Promise<Result> {
  const reasons: string[] = [];
  if (!email || typeof email !== 'string') {
    reasons.push('Email vacío o no es una cadena.');
    return { valid: false, reasons };
  }

  if (email.length > 254)
    reasons.push('Email demasiado largo (máx 254 caracteres).');

  const ok = isEmail(email, { allow_utf8_local_part: true, require_tld: true });
  if (!ok) reasons.push('Formato de email inválido.');

  return { valid: reasons.length === 0, reasons };
}

export const validateProductData = (
  productData: Partial<IProduct>
): { valid: boolean; message?: string } => {
  const { name, description, price, category, stock } = productData;

  if (!name || typeof name !== 'string') {
    return { valid: false, message: 'Nombre del producto inválido o faltante' };
  }

  if (!description || typeof description !== 'string') {
    return {
      valid: false,
      message: 'Descripción del producto inválida o faltante',
    };
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    return { valid: false, message: 'Precio del producto inválido o faltante' };
  }

  if (!category || typeof category !== 'string') {
    return {
      valid: false,
      message: 'Categoría del producto inválida o faltante',
    };
  }

  if (stock === undefined || typeof stock !== 'number' || stock < 0) {
    return { valid: false, message: 'Stock del producto inválido o faltante' };
  }

  return { valid: true };
};
