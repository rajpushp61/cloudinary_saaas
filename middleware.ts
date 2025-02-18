import { clerkMiddleware,createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home",
])
const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const currentUrl = new URL(req.url)
    const isAccessingDashboard = currentUrl.pathname==="/home"
    const isApiRequesst = currentUrl.pathname.startsWith("/api")

    if(userId && isPublicRoute(req) && !isAccessingDashboard){
        return NextResponse.redirect(new URL("/home",req.url))
    }
    //If user is not logged in
    if(!userId){
        //if user is not logged in and trying to access a protected route
        if(!isPublicRoute(req) && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in",req.url))
        }
        //if user is not logged in and trying to access a public route
        if(isApiRequesst && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in",req.url))
        }

    }
    return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)","/","/(ai|trpc)(.*)"]
  
};