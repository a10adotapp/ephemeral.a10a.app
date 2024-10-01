# Development

## Generate migrations

``` shell
npx prisma migrate dev --name ${MIGRATION_NAME}
```

## Apply migrations

``` shell
npx prisma migrate deploy
```

## Apply seeds

``` shell
cat $(find prisma/seeds -name *.sql | sort) \
 | mysql --host=db --user=root --password=root --database=ephemeral_a10a_app_dev -vvv
```

## Reset database

``` shell
echo '
  DROP DATABASE IF EXISTS ephemeral_a10a_app_dev;
  CREATE DATABASE IF NOT EXISTS ephemeral_a10a_app_dev;
' | mysql --host=db --user=root --password=root -vvv
```
