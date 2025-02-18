# Generated by Django 5.1.5 on 2025-02-01 11:23

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('games_played', models.IntegerField(default=0)),
                ('victories', models.IntegerField(default=0)),
                ('win_rate', models.IntegerField(default=0)),
                ('avg', models.IntegerField(default=0)),
                ('score', models.IntegerField(default=0)),
            ],
        ),
    ]
