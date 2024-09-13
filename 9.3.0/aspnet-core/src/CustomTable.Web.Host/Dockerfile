FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/CustomTable.Web.Host/CustomTable.Web.Host.csproj", "src/CustomTable.Web.Host/"]
COPY ["src/CustomTable.Web.Core/CustomTable.Web.Core.csproj", "src/CustomTable.Web.Core/"]
COPY ["src/CustomTable.Application/CustomTable.Application.csproj", "src/CustomTable.Application/"]
COPY ["src/CustomTable.Core/CustomTable.Core.csproj", "src/CustomTable.Core/"]
COPY ["src/CustomTable.EntityFrameworkCore/CustomTable.EntityFrameworkCore.csproj", "src/CustomTable.EntityFrameworkCore/"]
WORKDIR "/src/src/CustomTable.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/CustomTable.Web.Host", "src/CustomTable.Web.Host"]
COPY ["src/CustomTable.Web.Core", "src/CustomTable.Web.Core"]
COPY ["src/CustomTable.Application", "src/CustomTable.Application"]
COPY ["src/CustomTable.Core", "src/CustomTable.Core"]
COPY ["src/CustomTable.EntityFrameworkCore", "src/CustomTable.EntityFrameworkCore"]
WORKDIR "/src/src/CustomTable.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "CustomTable.Web.Host.dll"]
