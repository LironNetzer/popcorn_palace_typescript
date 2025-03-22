import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.create(AppModule, { abortOnError: false});
  // todo - change to this line? This line will create an error if there is a problem in the init phase, instead of exiting the program and return 1
  await app.listen(3000);
}
bootstrap();
