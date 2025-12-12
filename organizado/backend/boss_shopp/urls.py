"""boss_shopp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# Serve frontend files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Serve frontend HTML files
    frontend_dir = settings.BASE_DIR.parent / 'frontend'
    if os.path.exists(frontend_dir):
        from django.views.static import serve
        urlpatterns += [
            path('', lambda request: serve(request, 'index.html', document_root=frontend_dir)),
            path('<str:page>', lambda request, page: serve(request, page, document_root=frontend_dir) 
                 if page and not page.startswith('api/') and not page.startswith('admin/') 
                 else serve(request, 'index.html', document_root=frontend_dir)),
        ]