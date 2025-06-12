import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Puedes necesitar ajustar esta función para obtener el rol real del usuario desde Supabase
async function getUserRole(req: NextRequest): Promise<string | null> {
  // Ejemplo: leer cookie de sesión y hacer fetch a un endpoint API que devuelva el rol
  const supabaseToken = req.cookies.get('sb-access-token')?.value;
  if (!supabaseToken) return null;
  // Aquí deberías hacer una petición a tu API interna para obtener el rol
  // Por simplicidad, devolvemos null (no autenticado)
  // return await fetchRoleFromAPI(supabaseToken);
  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitir acceso libre a la home y rutas públicas
  if (pathname === '/' || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  // Proteger /dashboard y /admin
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    // Obtener sesión y rol del usuario
    const supabaseToken = req.cookies.get('sb-access-token')?.value;
    if (!supabaseToken) {
      // No autenticado, redirigir a login
      return NextResponse.redirect(new URL('/login', req.url));
    }
    const role = await getUserRole(req);

    // Si es admin y va a dashboard, redirigir a admin
    if (role === 'admin' && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    // Si no es admin y va a admin, redirigir a dashboard
    if (role !== 'admin' && pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    // Si todo está bien, permitir acceso
    return NextResponse.next();
  }

  // Para cualquier otra ruta, permitir acceso
  return NextResponse.next();
}

// Configuración de las rutas protegidas
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}; 