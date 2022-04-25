"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
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
from django.urls import path, re_path, include
from django.conf import settings
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf.urls.static import static

schema_view = get_schema_view( 
    openapi.Info( 
        title="SSIFI API Swagger", 
        default_version="v1", 
        description="SSIFI API 문서", 
        terms_of_service="", 
        contact=openapi.Contact(name="", email=""), 
        license=openapi.License(name=""), 
    ), 
    public=True, 
    permission_classes=(permissions.AllowAny,), 
)

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/channel/', include('channel.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += [
        re_path('api/swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name="schema-json"),
        re_path('api/swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        re_path('api/redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
        ]