FROM rust:1.85-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    bzip2 \
    libfreetype6 \
    libxi6 \
    libxrender1 \
    libxxf86vm1 \
    libgl1 \
    libglu1-mesa \
    libgomp1 \
    libxkbcommon0 \
    libsm6 \
    libice6 \
    libegl1 \
    libopengl0 \
    && rm -rf /var/lib/apt/lists/*

ENV BLENDER_VERSION=5.2.3
ENV BLENDER_URL=https://download.blender.org/release/Blender5.2/blender-5.2.3-linux-x64.tar.xz

RUN curl -sSL ${BLENDER_URL} -o blender.tar.xz \
    && tar -xf blender.tar.xz -C /opt/ \
    && rm blender.tar.xz \
    && mv /opt/blender-*-linux-x64 /opt/blender

RUN ln -s /opt/blender/blender /usr/local/bin/blender

WORKDIR /workspace

ENTRYPOINT ["blender", "--background"]
