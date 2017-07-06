FROM ruby:2.3.4
RUN apt-get update -qq && apt-get install -y build-essential apt-utils libpq-dev
#RUN npm install webpack -g

# Install node
RUN apt-get install -y python python-dev python-pip python-virtualenv
RUN rm -rf /var/lib/apt/lists/*

# compile from source
#RUN \
#  cd /tmp && \
#  wget http://nodejs.org/dist/v6.4.0/node-v6.4.0.tar.gz && \
#  tar xzvf node-v6.4.0.tar.gz && \
#  rm -f node-v6.4.0.tar.gz && \
#  cd node-v* && \
#  ./configure && \
#  CXX="g++ -Wno-unused-local-typedefs" make && \
#  CXX="g++ -Wno-unused-local-typedefs" make install && \
#  cd /tmp && \
#  rm -rf /tmp/node-v* && \
#  npm install -g npm && \
#  echo '\n# Node.js\nexport PATH="node_modules/.bin:$PATH"' >> /root/.bashrc

# Maybe we can just download the binary
RUN \
  cd /tmp && \
  wget http://nodejs.org/dist/v6.4.0/node-v6.4.0-linux-x64.tar.gz && \
  tar xzf node-v6.4.0-linux-x64.tar.gz && \
  rm -f node-v6.4.0-linux-x64.tar.gz && \
  cd node-v* && \
  cp bin/node /usr/bin && \
  ./bin/npm install -g npm && \
  cd /tmp && \
  rm -rf /tmp/node-v*

ENV APP_HOME /myapp
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
COPY . $APP_HOME

# Bundle ruby gems
COPY Gemfile $APP_HOME/Gemfile
COPY Gemfile.lock $APP_HOME/Gemfile.lock
ENV BUNDLE_GEMFILE=$APP_HOME/Gemfile \
  BUNDLE_JOBS=2 \
  BUNDLE_PATH=/bundle

RUN bundle install

#RUN npm config set registry http://registry.npmjs.org/ && npm install

RUN apt-get update -qq && apt-get install -y apt-transport-https
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -y yarn
#ENV YARN_MODULES=$APP_HOME/node_modules \
#  YARN_JOBS=2 \
#  YARN_PATH=/node_modules

RUN ./bin/yarn install


# This part is needed in production for heroku. Unfortunately, it's getting 
# in the way in development
ARG ASSET_HOST
RUN bin/rake ASSET_HOST=${ASSET_HOST} RAILS_ENV=production assets:precompile

RUN useradd -m myuser
USER myuser

CMD ./bin/rails s -p $PORT -b '0.0.0.0'
